import { useSession } from 'next-auth/react';
// import { use } from 'react';

export default function useCurrentUser() {
    const session = useSession();

    return session.data?.user;
}