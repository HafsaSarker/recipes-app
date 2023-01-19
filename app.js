//select all elements
const container = document.querySelector('.container');
const searchOptions = document.querySelector('.searchOptions');
const img = document.querySelector('.slide-img');
const detailBox = document.querySelector('.detail-box');
const filterRes = document.querySelector('.filterRes');
const viewRecipeRes = document.querySelector('.viewRecipeRes');

// remove all child elements from a parent element in the DOM
function deleteChildElements() {
    detailBox.innerHTML = "";
    img.innerHTML = "";
}
function deleteCategElements(parent){
    parent.innerHTML = "";
}

function resetCategoryRecipe(){
    viewRecipeRes.innerHTML = "";
}

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach( n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}))

const usrSearch = document.querySelector('.usr-inp');
const searchBtn = document.querySelector('.fa-search');

searchBtn.addEventListener("click", () => {
    handleSearch(usrSearch.value);
})

function handleSearch(userInp){

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userInp}`)
    .then(response => response.json())
    .then(response => {
        searchResults(response);
        showRecipes(response);
    })
}
function searchResults(data){
    searchOptions.innerHTML = `
        <h2>Search Results: </h2>
    `;

    data.meals.forEach((meal) => {
        searchOptions.innerHTML += `
            <button class="resOptn" value="${meal.strMeal}" >${meal.strMeal}</button>
        `;
    })

    const resOptn = document.querySelectorAll('.resOptn');
    resOptn.forEach(resOptn => {
        resOptn.addEventListener("click", () => {
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${resOptn.value}`)
            .then(response => response.json())
            .then(response => {
                showRecipes(response);
            })
        });
    })
}
function fetchRandRecipe(){
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(response => {
        showRecipes(response);
    })
}

//get ingredient array
function getIngredients(data){
    let count = 1;
    let ingredients = [];
    for(let i in data){
        let ingredient = "", measure = "";
        if(i.startsWith("strIngredient") && data[i]) {
            ingredient = data[i];
            measure = data[`strMeasure`+count];
            ingredients.push(`${ingredient}: ${measure}`);
            count++;
        }
    }
    return ingredients;
} 

function showRecipes(data){
    deleteChildElements();

    
    img.innerHTML =  `
    <img src="${data.meals[0].strMealThumb}" alt="1">
    `;

    //create new div w class "type" and append it to detailBox
    const newDiv1 =document.createElement("div");

    newDiv1.classList.add("type");

    newDiv1.innerHTML = `
        <a class="recipe-title" href="#">${data.meals[0].strMeal}</a>
        <span class="category" style="font-weight: bold; padding: 8px 0px;">
            Category: <span style="color: #da5502;">${data.meals[0].strCategory}</span>
        </span>
        <span class="recipe-instructions">${data.meals[0].strInstructions}</span>
    `;

    detailBox.append(newDiv1);

    const newDiv2 = document.createElement("div");

    newDiv2.classList.add("recipe-descr");
    newDiv2.innerHTML = `
        <h3>Ingredients</h3>
    `;

    const ul = document.createElement("ul");
    ul.classList.add("ingredients-list");

    //get ingredients 
    ingredients = getIngredients(data.meals[0]);
    ingredients.forEach((ingredient) => {
        ul.innerHTML += `
            <li><input type="checkbox"> ${ingredient}</li>
        `;
    })

    newDiv2.append(ul);
    detailBox.append(newDiv2);
}
fetchRandRecipe();

//grab filter buttons
const filterBtn = document.querySelectorAll(".filter-btn");

filterBtn.forEach(filterBtn => {
    filterBtn.onclick = () => FetchCategories(filterBtn.value);
})

//categories 
function FetchCategories(buttonValue){
    //filter by categories such as seafood, beef, 
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${buttonValue}`)
    .then(response => response.json())
    .then(response => {
        showCategoriesMeat(response);
    })
}

function showCategoriesMeat(data){
    deleteCategElements(filterRes);
    data.meals.forEach((meal) => {
        //create new div
        const meatCard = document.createElement("div");
        //give it class name
        meatCard.classList.add("meat-card");
        //set innerHTML
        meatCard.innerHTML = `
        <div class= "meat-card">
            <img class="meat-card-img" src=${meal.strMealThumb}>
            <div class= "meat-card-descr">
                <h4>${meal.strMeal}</h4>
                <button class="viewRecipe" value="${meal.idMeal}">View Recipe</button>
            <div> 
        </div>    
        `;

        //append
        filterRes.innerHTML += meatCard.innerHTML;
    })
    const viewRecipeBtn = document.querySelectorAll('.viewRecipe');

    viewRecipeBtn.forEach(viewRecipeBtn => {
        viewRecipeBtn.onclick = () => fetchByID(viewRecipeBtn.value);
    })

}

function fetchByID(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(response => response.json())
    .then(response => {
        ShowCategoryRecipe(response);
    })
}
function ShowCategoryRecipe(data){
    resetCategoryRecipe();
    let ingredients = getIngredients(data.meals[0]);
    viewRecipeRes.innerHTML = `
        <div class="buttonX" style="color:#da5502;cursor:pointer;"><p>X</p></div>
        <a class="recipe-title" href="#">${data.meals[0].strMeal}</a>
        <span class="category" style="font-weight: bold; padding: 8px 0px;">Category: <span style="color: #da5502;">${data.meals[0].strCategory}</span></span>
        <span class="recipe-instructions">${data.meals[0].strInstructions}</span>
        <h3>Ingredients</h3>
    `;
    const dispIngr = document.createElement("div");
    dispIngr.classList.add("dispIngr");
    const ul = document.createElement("ul");
    ul.classList.add("ingredients-list");
    dispIngr.classList.add("pop-up-ingr");

    for(const ingredient of ingredients){
        ul.innerHTML += `
            <li><input type="checkbox"> ${ingredient}</li>
        `;
    }

    dispIngr.append(ul);
    viewRecipeRes.append(dispIngr);
    let closeBtn = document.querySelector('.buttonX');

    viewRecipeRes.style.display = "flex";
    container.style.filter = "brightness(50%)";

    closeBtn.addEventListener("click", () => {
        viewRecipeRes.style.display = "none";
        container.style.filter = "none";
    })
}
FetchCategories("Beef");