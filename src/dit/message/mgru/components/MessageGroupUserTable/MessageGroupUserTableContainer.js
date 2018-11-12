import { connect } from 'react-redux';
import MessageGroupUserTableDisplay from './MessageGroupUserTableDisplay';
import { removeMessageGroupUser, fetchMessageGroupUsers } from '../../actions/MessageGroupUserAction';

const mapStateToProps = state => ({
  messageGroupUserList: state.mgruTransaction.mgru.messageGroupUserList,
});

export default connect(
  mapStateToProps,
  { removeMessageGroupUser, fetchMessageGroupUsers },
)(MessageGroupUserTableDisplay);