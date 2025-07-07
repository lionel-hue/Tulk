export function append_article(data, i)
{
    const article = document.createElement('div')
            
    article.innerHTML = document.querySelector('.posts').innerHTML

    article.setAttribute("class", document.querySelector('.posts').getAttribute("class") )

    article.querySelector(".post-id").innerHTML = data[i].id_article

    article.querySelector(".profile-pic").setAttribute('src', `./assets/images/${data[i].profile_pic}`)

    article.querySelector("strong").innerHTML = `${data[i].prenom} ${data[i].nom}`

    article.querySelector('.post-content').innerHTML = data[i].description

    article.querySelector('.post-image').setAttribute('src', `assets/images/${data[i].image_article}`)

    article.querySelector("span[class=text-muted]").innerHTML = data[i].date

    document.querySelector("div[class='main-content py-4 flex-grow-1 mt-0']").appendChild(article)
}