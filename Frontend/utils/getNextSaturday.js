export const getNextSaturday = () => {
    const nextSaturday = new Date();
      nextSaturday.setDate(nextSaturday.getDate() + ( 13 - nextSaturday.getDay()) % 7)
     return nextSaturday.toLocaleDateString('fr-FR').split("/").reverse().join("-")
}