import Axios from 'axios';
import { PRIVATE_HOST_URL } from 'Config/constants';
import { getAuthHeaders, getIdToken } from 'lib/firebase/auth';
import { SubscriptionService } from './interface';

export class SubscriptionApi implements SubscriptionService {
  async getUserDetails(): Promise<any> {
    return getIdToken()
      .then((token: string) =>
        Axios.get(
          `${PRIVATE_HOST_URL}/apiStripeCustomer/request/details`,
          getAuthHeaders(token)
        )
      )
      .then(resp => {
        console.log(resp);
        return {
          cards: resp.data.cards && resp.data.cards,
          subscriptions: resp.data.subscriptions && resp.data.subscriptions
        };
      });
  }

  async updateUserDetails(tokenVal: any): Promise<any> {
    return getIdToken()
      .then((token: string) =>
        Axios.post(
          `${PRIVATE_HOST_URL}/apiStripeCustomer/request/source`,
          { token: tokenVal },
          getAuthHeaders(token)
        )
      )
      .then(resp => {
        return {
          data: resp
        };
      });
  }

  async getInvoiceDetails(): Promise<any> {
    return getIdToken()
      .then((token: string) =>
        Axios.get(
          `${PRIVATE_HOST_URL}/apiStripeCustomer/request/invoices`,
          getAuthHeaders(token)
        )
      )
      .then(resp => {
        return {
          invoices: resp.data.data && resp.data.data
        };
      });
  }

  async cancelSubscription(subscriptionId: any): Promise<any> {
    return getIdToken()
      .then((token: string) =>
        Axios.delete(
          `${PRIVATE_HOST_URL}/apiStripeCustomer/request/subscription/${subscriptionId}`,
          getAuthHeaders(token)
        )
      )
      .then(resp => {
        return {
          invoices: resp.data && resp.data
        };
      });
  }
}
