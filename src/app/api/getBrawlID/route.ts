import { cookies } from 'next/headers';

export async function GET() {
    try {
        // Get the BrawlID from the cookie
        const cookieStore = await cookies();
        const brawlID = cookieStore.get('brawlID')?.value;
        console.log("cookie gotten", brawlID);
        if (!brawlID) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ brawlID }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error }), { status: 500 });
    }
}
