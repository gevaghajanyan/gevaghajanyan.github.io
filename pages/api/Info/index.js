import info from '../../../info';

export default function handler(req, res) {
  res.end(JSON.stringify(info));
}
