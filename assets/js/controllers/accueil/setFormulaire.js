export async function setFormulaire()
{
    return fetch("/api/user.php")
    .then( res => res.json() )
    .then( data => {
        const formulaire = document.querySelector("#accueilForm")
        formulaire.getElementsByTagName("img")[0].setAttribute("src", `./assets/images/${data["image"]}`)
    } )
}