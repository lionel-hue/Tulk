export function modifier_profile() 
{
    document.getElementById('editProfileForm').addEventListener('submit', async function (e) 
    {
        e.preventDefault()

        const form = e.target
        const formData = new FormData(form)

        const res = await fetch('/api/profile/profile.php', 
        {
            method: 'POST',
            body: formData
        })

        const res_2 = await fetch('/api/user.php')

        const data = await res_2.json()

        console.log(data)

        document.querySelectorAll("div[class='profile-banner position-relative'] img")[0].setAttribute("src", `./assets/images/${data["image"]}`)

        document.querySelectorAll("div[class='profile-banner position-relative'] img")[1].setAttribute("src", `./assets/images/${data["image"]}`)

        document.querySelector("div[class='text-center profile-name'] h2").textcontent = `${data['nom']} ${data["prenom"]}`

        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'))
        modal.hide()
    })
}

export function set_profile()
{
    ;
}