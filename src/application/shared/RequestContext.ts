export type RequestContext = {
  correlationId: string; // requis (observabilité)
  ipHash?: string;
  userAgentHash?: string;

  // actor (venant d’un guard ou API Gateway)
  actorUserId?: string;
};
