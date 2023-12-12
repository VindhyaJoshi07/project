

export const handler = async (event) => {
    
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    
    var lang='';
    if(event.lang=='c') 
        lang='cpp';
    
    if(event.lang=='j')
        lang='java';
    
    if(event.lang=='p')
        lang='python3';

   const url = 'https://api.jdoodle.com/v1/execute'
   
 //Invoking compiler API to evaluate the Program.
   var program = {
     script : event.code,
     stdin:   event.input,
     language: lang,
     versionIndex: "0",
     clientId: "9407420d85a9c9c6fdf8c4b4e73f3e0",
     clientSecret:"38dfb6c79a7c96b041c9782b6bb4c257460345e0aaa30cb47278e006d16cc783"
   };

    console.log("Program.."+JSON.stringify(program));

  const customHeaders = {
    "Content-Type": "application/json",
   }

   console.log("body: "+JSON.stringify(program))


const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(program)
 };

let apiResponse = await fetch(url, requestOptions);

   const isJson = apiResponse.headers.get('content-type')?.includes('application/json');
   const data = isJson && await apiResponse.json();
 
   console.log("data.."+JSON.stringify(data));
   console.log("output.."+data.output)
   console.log("StatusCode.."+data.statusCode)
   console.log("compilationStatus.."+data.compilationStatus)

  return {
     statusCode:data.statusCode,
     output:data.output
  }
};
