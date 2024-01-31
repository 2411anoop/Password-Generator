const inputSlider=document.querySelector('[data-lengthSlider]'); // we have used custom attribute to fetch the desired element.
const lengthDisplay=document.querySelector('[data-lengthNumber]');

const passwordDisplay=document.querySelector('[data-passwordDisplay]');
const copyBtn=document.querySelector('[data-copy]');
const copyMsg=document.querySelector('[data-copyMsg]');
const uppercaseCheck=document.querySelector('#uppercase');
const lowercaseCheck=document.querySelector('#lowercase');
const numbersCheck=document.querySelector('#numbers');
const symbolsCheck=document.querySelector('#symbols');
const indicator=document.querySelector('[data-indicator]');
const generateBtn=document.querySelector('.generateButton');
const allCheckBox=document.querySelectorAll('input[type=checkbox]')
const symbols='`~!@#$%^&*()_-+={[}]|;:"<,>.?/';

let password='';
let passwordLength=10;// default value of password
let checkCount=0;// no. of boxes checked by default.
//Set strngth circle to grey by default
setIndicator('#ccc')

handleSlider();

//set password length acc to we slide
function handleSlider(){
    inputSlider.value=passwordLength;//providing initial value to 10 to slider
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength - min)*100/(max-min))+ "%  100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow khud se 
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));// for a to z we have provided its value and converted it into string 
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));// for A to Z we have provided its value and converted it into string 
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);// char at that index
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasLower && hasUpper && (hasNum||hasSym) && passwordLength>=8){
        setIndicator('#0f0');
    } else if(
        (hasLower||hasUpper)&&
        (hasNum||hasSym)&&
        passwordLength>=6
    ){
        setIndicator('#ff0');
    } else{
        setIndicator('#f00');
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);// method to copy from clipbord. Also it returns a promise
        copyMsg.innerText='copied';
    }
    catch(e){
        copyMsg.innerText='Failed!';
    }
    // to make copy wala span visible
    copyMsg.classList.add('active');

    setTimeout(()=>{
        copyMsg.classList.add('active');
    },2000);
}


function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });
    //special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})



inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent(); // agr koi value padi hogi toh copy ho jayegi nhi toh nhi ho payegi
    }
})

generateBtn.addEventListener('click',()=>{
    if(checkCount <=0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //journey to find new password

    //remove old password
    password="";

    //putting the stuff mentioned in the check boxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr=[];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsary addition
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    console.log('Compulsary addition done');

    //remaining addn
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex=getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log('Remainig addition done');

    //shuffling the characters, if not done it may be easy to predict as first one will be UC, Lc ..
    password=shufflePassword(Array.from(password));

    function shufflePassword(array){
        // Algorithm to shuffle --- Fisher Yates Method. It can be applied on an array to shuffle.
        for(let i=array.length-1;i>0;i--){
            const j=Math.floor(Math.random()*(i+1));
            const temp=array[i];
            array[i]=array[j];
            array[j]=temp;
        }
        let str='';
        array.forEach((el)=>(str+=el));
        return str;
    }

    console.log('Shuffling done');

    //display it in UI
    passwordDisplay.value=password;

    console.log('UI addition done');

    // strength calculn
    calcStrength();
})