export const appConfig = {
    appName:{first:"Medi", second:"Extract"},
    version: "v4.8.2",
    color:{
        primary:"#74B87B"
    }
};


export const theme = ()=>{
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        return savedTheme;
    }   
    return  null;
}