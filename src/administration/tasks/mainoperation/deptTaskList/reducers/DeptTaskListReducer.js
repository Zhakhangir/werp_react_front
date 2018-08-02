import {
  DEPT_TASK_LIST_DIRECTORIES,
  CLEAR_DEPT_TASK_LIST,
  FOUND_DEPT_TASKS,
} from '../actions/DeptTaskListAction';
import { FETCH_TASK_DETAILS } from '../../../../../crm/callCenter/mainoperation/task/actions/TaskAction';

export default function (state = {}, action) {
  // eslint-disable-next-line
    switch(action.type) {
    case DEPT_TASK_LIST_DIRECTORIES:
      return { ...state, directories: action.payload };
    case FOUND_DEPT_TASKS:
      return { ...state, result: action.payload };
    case CLEAR_DEPT_TASK_LIST:
      return { ...state, directories: undefined, result: undefined };
    case FETCH_TASK_DETAILS:
      return { ...state, taskDetails: action.payload };
  }

  return state;
}
