import axios from "axios";

export class MempoolApi {

  constructor(params) {
    let axios_ = axios.create({
      baseURL: params.baseUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    axios_.interceptors.response.use(
      (async (
        response
      ) => {
        const res = response.data;
        return res;
      }) ,
      (error) => {
        if (error.status == 400) {
          return Promise.reject(error.response.data);
        }
        if (error.response) {
          return Promise.reject(
            new RequestError(
              error.response.data,
              error.response.status,
              error.response
            )
          );
        }

        if (error.isAxiosError) {
          return Promise.reject(new RequestError("noInternetConnection"));
        }
        return Promise.reject(error);
      }
    );
  }

  async getRecommendFee() {
    const response = await axios_.get(
      "/v1/fees/recommended",
      {}
    );
    return response;
  }

  async getRawTx(txid ) {
    const response = await axios_.get(`/tx/${txid}/hex`);
    return response;
  }
}
