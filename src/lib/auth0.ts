// lib/auth0.js

import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Initialize the Auth0 client 
export const auth0 = new Auth0Client({
  domain: 'https://dev-hpl6vv3d86u8yfyi.us.auth0.com',
  clientId: '9nihJwJco98TxCKctzIbyGZfD4ZVVw2F',
  clientSecret: 'n9hl1OY4RuP7BlUXX85PLhscZIaZXoggh2ap12mO7oaDoJb4O1ZYBDKJWlVvk3JT',
  appBaseUrl: 'http://localhost:3000',
  secret: 'e120f49ec8bbcfcf96fff321a414dea52da87b9bfefb72fbc194f89d47e1cf6b',
});