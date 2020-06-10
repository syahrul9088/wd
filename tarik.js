const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
var randomize = require('randomatic')
var random = require('random-name')
const cheerio = require('cheerio');
const delay = require('delay')
var md5 = require('md5');

const functionSendOtp = (nomor, auth, hash) => new Promise((resolve, reject) => {
    const bodys = {
        mobile_number: `+62${nomor}`,
        referral_code: '',
        otp_hash: hash
        }
    
      fetch('https://xcelpay.io/api/share-earn/register', { 
          method: 'POST', 
          body: JSON.stringify(bodys),
          headers: {
            'authorization': auth,
            'Content-Type': 'application/json',
            'Content-Length': 83,
            'Host': 'xcelpay.io',
            'Connection': 'Keep-Alive',
            'Accept-Encoding': 'gzip',
           // 'Cookie': 'id=s%3Ac7ecBrYy4Te9B75_1RZOeRN5NkhXlReT.1sZ%2BsFihwF4qBEY%2F%2BWxSrDhJdaKqZpKA0tHjIIuSP5A',
            'User-Agent': 'okhttp/3.12.1'
          }
      })
      .then(res => res.json())
      .then(result => {
          resolve(result);
      })
      .catch(err => reject(err))
  });

const functionVerifOtp = (otp, nomor, auth) => new Promise((resolve, reject) => {
    const bodys = {
        mobile_number: `+62${nomor}`,
        otp_code: otp
        }
    
      fetch('https://xcelpay.io/api/share-earn/verify-otp', { 
          method: 'POST', 
          body: JSON.stringify(bodys),
          headers: {
            'authorization': auth,
            'Content-Type': 'application/json',
            'Content-Length': 51,
            'Host': 'xcelpay.io',
            'Connection': 'Keep-Alive',
            'Accept-Encoding': 'gzip',
            //'Cookie': 'id=s%3Ac7ecBrYy4Te9B75_1RZOeRN5NkhXlReT.1sZ%2BsFihwF4qBEY%2F%2BWxSrDhJdaKqZpKA0tHjIIuSP5A',
            'User-Agent': 'okhttp/3.12.1'
          }
      })
      .then(res => res.json())
      .then(result => {
          resolve(result);
      })
      .catch(err => reject(err))
  });


const functionWd = (id, wallet, bearer) => new Promise((resolve, reject) => {
    const bodys = {
        user_id: id,
        wallet_address: wallet
        }
    
      fetch('https://xcelpay.io/api/share-earn/withdraw', { 
          method: 'POST', 
          body: JSON.stringify(bodys),
          headers: {
            'authorization': `Bearer ${bearer}`,
            'Content-Type': 'application/json',
            'Content-Length': 100,
            'Host': 'xcelpay.io',
            'Connection': 'Keep-Alive',
            'Accept-Encoding': 'gzip',
            //'Cookie': 'id=s%3A5h380jb4IhP0D-jIO-L31hJhboOPKxn2.3B5OlMS%2Fh%2BgcODXL3o7Cmbh7iCHNmet4xSj%2FZTe8EGI',
            'User-Agent': 'okhttp/3.12.1'
          }
      })
      .then(res => res.json())
      .then(result => {
          resolve(result);
      })
      .catch(err => reject(err))
  });

const functionBalance = (bearer) => new Promise((resolve, reject) => {
    fetch('https://xcelpay.io/api/share-earn/user-balance', { 
        method: 'GET', 
        headers: {
          'authorization': `Bearer ${bearer}`,
          'Content-Type': 'application/json',
          'Host': 'xcelpay.io',
          'Connection': 'Keep-Alive',
          'Accept-Encoding': 'gzip',
         // 'Cookie': 'id=s%3A5h380jb4IhP0D-jIO-L31hJhboOPKxn2.3B5OlMS%2Fh%2BgcODXL3o7Cmbh7iCHNmet4xSj%2FZTe8EGI',
          'User-Agent': 'okhttp/3.12.1'
        }
    })
    .then(res => res.json())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

(async () => {
    try {
        const hash = randomize('Aa0',12)
        const auth = md5(hash)
        const nomor = readlineSync.question('[?] NOMOR HP (ex: 8190XXXXXX): ')
        const send = await functionSendOtp(nomor, auth, hash)
        const otp = send.otp
        console.log(`[+] OTP: ${otp}`)
        const verif = await functionVerifOtp(otp, nomor, auth)
        const bearer = verif.token
        const id = verif.userDetails._id
        if (verif.status == 200){
            console.log('[+] Berhasil login!')
            console.log(`[+] Reff code: ${verif.userDetails.referral_code}`)
            const balance = await functionBalance(bearer)
            console.log(`[+] Balance: ${balance.balance}`)
            const tanya = readlineSync.question('[?] Mencoba WD (y/n): ')
            if (tanya == 'y'){
                const wallet = readlineSync.question('[?] Wallet XLAB: ')
                const wd = await functionWd(id, wallet, bearer)
                console.log(wd.message)
            } else {
                console.log('[!] WD cancel!')
            }
        } else {
            console.log('[!] Gagal login!')
        }
        // const get = await functionWd()
        // console.log(get)
    } catch (e) {
        console.log(e)
    }
})()