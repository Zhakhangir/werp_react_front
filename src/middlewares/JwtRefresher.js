import jwt from 'jwt-simple';
import moment from 'moment';
import browserHistory from '../utils/history';
import { TOKEN_REFRESH_LIMIT, TOKEN_PASSWORD } from '../utils/constants';
import { resetLocalStorage } from '../utils/helpers';
import { UNAUTH_USER, AUTH_ERROR, CHANGE_LANGUAGE } from '../actions/types';
import { doGet } from '../utils/apiActions';

const signoutUser = (dispatch, errorMsg) => {
  resetLocalStorage();
  dispatch({ type: UNAUTH_USER });
  dispatch({ type: AUTH_ERROR, payload: errorMsg });
  browserHistory.push('/');
};

const requestToken = (dispatch, token, language) => {
  doGet(`tokenRefresh`, {
    language,
  })
    .then(({ data }) => {
      // If request is good...
      // - save the refreshed JWT token
      localStorage.setItem('token', data.token);
      // setAuthorizationHeader(data.token);
    })
    .catch(error => {
      signoutUser(dispatch, '');
    });
};

const tokenRefresherMiddleware = ({ dispatch }) => next => action => {
  let isRenewingToken = false;
  const token = localStorage.getItem('token');
  const formAction =
    (action.meta && action.meta.form) || typeof action === 'function';

  if (action.type === CHANGE_LANGUAGE) {
    try {
      jwt.decode(token, TOKEN_PASSWORD);
      token && requestToken(dispatch, token, action.payload);
      return next(action);
    } catch (error) {
      return next(action);
    }
  }

  if (formAction || !token) {
    return next(action);
  }

  if (!isRenewingToken) {
    try {
      const tokenPayload = jwt.decode(token, TOKEN_PASSWORD);
      const exp = moment.utc(tokenPayload.exp * 1000);
      const now = moment.utc();
      const remainedUntilRefresh = exp.diff(now, 's');
      if (remainedUntilRefresh < TOKEN_REFRESH_LIMIT) {
        isRenewingToken = true;
        requestToken(dispatch, token, tokenPayload.language);
        isRenewingToken = false;
      }
    } catch (error) {
      isRenewingToken = false;
      signoutUser(dispatch, error.message);
    }
  }

  next(action);
};

export default tokenRefresherMiddleware;
