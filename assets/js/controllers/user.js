export async function get_user()
{
    const res  = await fetch("/api/user.php")
    
    return await res.json()
}