import { redirect } from 'next/navigation';

export default function ApplyPage() {
  redirect('/users/new');
  return null;
}
