// Modulos externos
import chalk from 'chalk';
import inquirer from 'inquirer';

// Modulos internos
import fs from 'fs';

operation()


function operation(){
    inquirer.prompt([{
        type: 'list',
        name: 'action', 
        message: 'O que você deseja fazer?',
        choices:[
            'Criar Conta', 
            'Consultar Saldo', 
            'Depositar',
            'Sacar',
            'Sair'
        ],
    },
])
.then((answer) => {
    const action = answer['action']

    if(action === 'Criar Conta'){
        createAccount();
    } else if(action === 'Consultar Saldo'){
        getAccountBalance();
    }else if(action === 'Depositar'){
        deposit()
    }else if(action === 'Sacar'){

    }else if(action === 'Sair'){
        console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
        process.exit()
    }
}).catch((err) => console.log(chalk.red(err)))
}

// create an account
function createAccount() {
    console.log(chalk.bgGreen.black('Parabens por usar o Account!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))
    buildAccount();
}

function buildAccount(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite o nome para a sua conta:'
    }]).then(answer => {
        const accountName = answer['accountName'];
        console.info(answer['accountName'])

        if (!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }
        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black(`Esta conta já existe, escolha outro nome!`))
            buildAccount()
            return
        }

        fs.writeFileSync(
            `accounts/${accountName}.json`, 
            '{"balance": 0}',
            function (err) {
                console.log(err)
            },
        )

        console.log(chalk.green(`Conta criada com sucesso`))
        operation();

    }).catch((err) => console.log(chalk.red(err)))
}

// adicionar valor a conta

function deposit(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {

        const accountName = answer['accountName']

        // verificar se a conta existe
        if(!checkname(accountName)){
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Qual seria o valor do deposito?'
            }
        ]).then((answer) => {
            const amount = answer['amount']

            addAmount(accountName, amount)
            operation()

        }).catch((err) => console.log(chalk.red(err)))

    }).catch((err) => console.log(chalk.red(err)))
}

// Validação do nome

function checkname(account){
    if(!fs.existsSync(`accounts/${account}.json`)){
        console.log(chalk.bgRed.black('Sua conta não existe favor criar uma'))
        return false
    }

    return true
}

// adicionar deposito 
function addAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.red('Aconteceu algum erro'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    
    fs.writeFileSync(`accounts/${accountName}.json`,JSON.stringify(accountData), function (err) {
        console.log(err)}, )

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))

}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{
        encoding: 'utf8',
        flag: 'r',
    })

    return JSON.parse(accountJSON)
}

// Consultando valor 
function getAccountBalance(){
    inquirer.prompt([
        {
            name: 'AccountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer)=>{
        const accontName = answer['AccountName']
        // verificar existencia da conta
        if(!checkname(accontName)){
            return getAccountBalance()
        }

        const accontData = getAccount(accontName);
        console.log(chalk.bgBlue.Black(`Oi ${accontName}. Seu saldo é de R$${parseFloat(accontData.balance)}`))
        operation()

    }).catch(err => console.log(chalk.red(err)))
}

// sacar valor

function withdraw(){
    
}