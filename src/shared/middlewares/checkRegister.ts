//------------------------------------- Types -------------------------------------
interface FormTypes {
    name: string;
    email: string;
    password: string;
}

interface FormTypesSend {
    name: string | boolean;
    email: string | boolean;
    password: string | boolean;
}

type ReturnFunc = false | string;

//------------------------------------- Function -------------------------------------

export default function checkRegister({ name, email, password }: FormTypes): FormTypesSend {
    const cName = checkName(name);
    const cEmail = checkEmail(email);
    const cPassword = checkPassword(password);
    return {
        name: cName,
        email: cEmail,
        password: cPassword,
    };
}

const regexUpper = /[A-ZÀÁÂÃÈÉÊÌÍÎÒÓÕÔÙÚÛÇ\s]/;
const regexLower = /[a-zàáâãèéêìíîòóõôùúûç\s]/;
const regexNumber = /[0-9]/;

//Check name
function checkName(name: string): ReturnFunc {
    let userName = name;
    let isLetter = true;

    if (name.length <= 1) return false;

    for (let i = 0; i < name.length; i++) {
        if (!name[i].match(regexLower) && !name[i].match(regexUpper)) {
            isLetter = false;
            break;
        }
    }

    if (!isLetter) return false;

    if (name[0] !== name[0].toUpperCase()) {
        const firstLetter = name[0].toUpperCase();
        userName = `${firstLetter}${name.substring(1, name.length)}`;
    }

    return userName;
}

//Check email
function checkEmail(email: string): ReturnFunc {
    const regexSpecial = /[-_*&#.]/;

    if (email.match(/[@]/g) !== null) {
        if (email.match(/[@]/g)?.length !== 1) {
            return false;
        }
    } else {
        return false;
    }

    const [name, domain] = email.split('@');

    //CHECK EMAIL NAME
    if (name.length <= 1) return false;
    if (name.includes('.')) {
        if (name.startsWith('.') || name.endsWith('.')) return false;
    }
    for (let i = 0; i < name.length; i++) {
        if (name[i] === '.' && name[i + 1] === '.') return false;
        if (
            !name[i].match(regexUpper) &&
            !name[i].match(regexLower) &&
            !name[i].match(regexSpecial) &&
            !name[i].match(regexNumber)
        )
            return false;
    }

    //CHECK DOMAIN
    if (domain.match(/[.]/g) === null) return false;
    if (domain.match(/[.]/g)?.length === 1) {
        const [typeMail, dot] = domain.split('.');
        if (typeMail.length <= 1) return false;
        for (let i = 0; i < typeMail.length; i++) {
            if (
                !typeMail[i].match(regexUpper) &&
                !typeMail[i].match(regexLower) &&
                !typeMail[i].match(regexNumber)
            )
                return false;
        }
        if (dot !== 'com') return false;
    } else return false;

    return email.toLowerCase();
}

//Check password
function checkPassword(password: string): ReturnFunc {
    const regexSpecial = /[-_*&@#.]/;

    //Upper
    if (!password.match(regexUpper)) return false;
    //Lower
    if (!password.match(regexLower)) return false;
    //Number
    if (!password.match(regexNumber)) return false;
    //Special
    if (!password.match(regexSpecial)) return false;
    //Length
    if (password.length <= 7) return false;

    return password;
}
