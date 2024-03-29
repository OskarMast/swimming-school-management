import SkillService from 'src/modules/skill/skillService';
import Errors from 'src/modules/shared/error/errors';
import Message from 'src/view/shared/message';
import { getHistory } from 'src/modules/store';
import { i18n } from 'src/i18n';

const prefix = 'SKILL_FORM';

const skillFormActions = {
  INIT_STARTED: `${prefix}_INIT_STARTED`,
  INIT_SUCCESS: `${prefix}_INIT_SUCCESS`,
  INIT_ERROR: `${prefix}_INIT_ERROR`,

  CREATE_STARTED: `${prefix}_CREATE_STARTED`,
  CREATE_SUCCESS: `${prefix}_CREATE_SUCCESS`,
  CREATE_ERROR: `${prefix}_CREATE_ERROR`,

  UPDATE_STARTED: `${prefix}_UPDATE_STARTED`,
  UPDATE_SUCCESS: `${prefix}_UPDATE_SUCCESS`,
  UPDATE_ERROR: `${prefix}_UPDATE_ERROR`,

  doInit: (id) => async (dispatch) => {
    try {
      dispatch({
        type: skillFormActions.INIT_STARTED,
      });

      let record = {};

      const isEdit = Boolean(id);

      if (isEdit) {
        record = await SkillService.find(id);
      }

      dispatch({
        type: skillFormActions.INIT_SUCCESS,
        payload: record,
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: skillFormActions.INIT_ERROR,
      });

      getHistory().push('/admin/skill');
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: skillFormActions.CREATE_STARTED,
      });

      await SkillService.create(values);

      dispatch({
        type: skillFormActions.CREATE_SUCCESS,
      });

      Message.success(i18n('skill.doAddSuccess'));

      getHistory().push('/admin/skill');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: skillFormActions.CREATE_ERROR,
      });
    }
  },

  doUpdate: (id, values) => async (dispatch, getState) => {
    try {
      dispatch({
        type: skillFormActions.UPDATE_STARTED,
      });

      await SkillService.update(id, values);

      dispatch({
        type: skillFormActions.UPDATE_SUCCESS,
      });

      Message.success(i18n('skill.doUpdateSuccess'));

      getHistory().push('/admin/skill');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: skillFormActions.UPDATE_ERROR,
      });
    }
  },
};

export default skillFormActions;
