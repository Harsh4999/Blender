const url = "https://news-pvx.herokuapp.com/";
const getnews=async()=>{
	cosnole.log(await axios.get(url));
}