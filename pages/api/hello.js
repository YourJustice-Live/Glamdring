// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withSentry } from '@sentry/nextjs';

// export default funct ? ion handler(req, res) {
const handler = (req, res) {
  res.status(200).json({ name: 'John Doe' });
}

export default withSentry(handler);

