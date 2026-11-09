const itemPrice =25;
const quantity =3;
const total = itemPrice * quantity; // type known as result of values type calculation and substitution
const displayedTotal ="75";
const isVisible = true;
const isEnabled = false;
const isSubmit = isVisible && isEnabled; // type known as result of values type calculation and substitution   
const readAction  = !isSubmit || total <=0;
console.log({ total , isSubmit , readAction });