export const changeFont = (font: string) => {
    let fontValue;
    switch (font) {
        case 'Poppins':
            fontValue = "\"Poppins\", sans-serif";
            break;
        case 'Merriweather':
            fontValue = "\"Merriweather\", serif";
            break;
        default:
            fontValue = "\"Poppins\", sans-serif";
            break;
    }
    document.documentElement.style.setProperty('--fontStyle', fontValue);
}

export const changeTheme = (theme: string) => {
    let mainBackground, secondaryBackground, textColor, primaryColor, accentColor, borderColor;
    switch (theme) {
        case 'Light':
            mainBackground = "#F8F8FA";
            secondaryBackground = "#F1F1F5";
            primaryColor = "#FFF";
            accentColor = "#FFD6DA";
            textColor = "#383B42";
            borderColor = "#383B42";
            break;
        case 'Dark':
            mainBackground = "#0F171E";
            secondaryBackground = "#26272C"; 
            textColor = "#F8F2F4";
            primaryColor = "#080709";
            accentColor = "#111013";
            borderColor = "#F8F2F4";
            break;
        case 'Olive':
            mainBackground = "#AAB396";
            secondaryBackground = "#808E67";
            textColor = "#FFF8E8";
            primaryColor = "#AAB396";
            accentColor = "#808E67";
            borderColor = "#FFF8E8";
            break;
        default:
            mainBackground = "#AAB396";
            secondaryBackground = "#808E67";
            textColor = "#FFF8E8";  
            primaryColor = "#AAB396";
            accentColor = "#808E67";
            borderColor = "#FFF8E8"; 
    }
    document.documentElement.style.setProperty('--backgroundColor', mainBackground);
    document.documentElement.style.setProperty('--secondaryColor', secondaryBackground);
    document.documentElement.style.setProperty('--textColor', textColor);
    document.documentElement.style.setProperty('--primaryColor', primaryColor);
    document.documentElement.style.setProperty('--accentColor', accentColor);
    document.documentElement.style.setProperty('--borderColor', borderColor);
}