export function modifier_profile() 
{
    let params = new URLSearchParams(window.location.search)
    let id_ami = params.get("id_ami")

    document.querySelector("div[class='mb-3'] input[id=id]").value= id_ami

    document.getElementById('editProfileForm').addEventListener('submit', async function (e) 
    {
        e.preventDefault()

        const form = e.target
        const formData = new FormData(form)

        await fetch('/api/profile/profile.php',
            {
                method: 'POST',
                body: formData
            })
  
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'))
        modal.hide()
        await set_profile()
    })
}   

export async function set_profile() 
{
    let params = new URLSearchParams(window.location.search)
    let id_ami = params.get("id_ami")

    const res = await fetch(`/api/user.php?id_ami=${id_ami}`)

    const data = await res.json()

    
    document.querySelectorAll("div[class='profile-banner position-relative'] img")[0].setAttribute("src", `./assets/images/${data["image"]}`)
    
    document.querySelectorAll("div[class='profile-banner position-relative'] img")[1].setAttribute("src", `./assets/images/${data["image"]}`)

    document.querySelector("div[class='text-center profile-name'] h2[class='fw-bold mb-1']").textContent = `${data['nom']} ${data["prenom"]}`

    document.querySelector("input[id='nom']").value = data["nom"]

    document.querySelector("input[id='prenom']").value = data["prenom"]

    document.querySelector("img[class='rounded-circle border border-3 border-white shadow']").setAttribute("src", `./assets/images/${data["image"]}`)

}