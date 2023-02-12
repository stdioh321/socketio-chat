
export default class MessageDto {
  public id:string | undefined;
  public message:string | undefined;
  public room:string[] | undefined;
  public createdAt:Date | undefined;
}