import { ActionUserEntity } from '../user';

export interface ActionComment {
  _id: string;
  text: string;
  createdBy: ActionUserEntity;
}
