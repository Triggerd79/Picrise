import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { deleteUser, updateUser } from '@/lib/actions/user.action';

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Error: Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local',
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  const { id, username, first_name, last_name, image_url, email_addresses } =
    evt.data;
  const eventType = evt.type;

  // User created
  if (eventType === 'user.created' || eventType === 'user.updated') {
    await updateUser({
      userId: id,
      firstName: first_name,
      lastName: last_name,
      email: email_addresses[0].email_address,
      username: username ?? id.toString().slice(0, 5) + id.toString().slice(-5),
      image: image_url ?? '',
    });
  }

  // User deleted
  if (eventType === 'user.deleted') {
    deleteUser(id);
  }

  return new Response('Webhook received', { status: 200 });
}
