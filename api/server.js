export const config = {
  runtime: 'edge'
};

import handler from '../dist/server/index.mjs';

export default async function(req, context) {
  return handler.fetch(req, context);
}