
export type Cards = {
  cards: string[],
  subscriptions: string[],
}

export interface SubscriptionService {

  getUserDetails(): Promise<Cards> 

}