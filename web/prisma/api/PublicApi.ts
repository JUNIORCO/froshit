import UniversityApi from './UniversityApi';

class PublicApi {
  public readonly University: UniversityApi;

  constructor() {
    this.University = new UniversityApi();
  }
}

export default PublicApi;
