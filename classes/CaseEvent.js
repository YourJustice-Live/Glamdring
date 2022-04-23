/**
 * Class for the case event.
 */
export default class CaseEvent {
  constructor(id, caseEntity, createdDate, type, data) {
    this.id = id;
    this.caseEntity = caseEntity;
    this.createdDate = createdDate;
    this.type = type;
    this.data = data;
  }
}
