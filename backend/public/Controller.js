const cardCapturer = {
    data() {
        return {
            message: 'Welcome to the card capturer. Here you can provide your card details and VGS will secure them. You can also go to our revealer if you already have your tokenized info',
            cardNumber: '',
            ccv: '',
            errorMessage: '',
            tokenized: false
        }
    },

    methods: {
        toggleTokenizer(){
            if(this.tokenized==false){
                this.tokenized=true;
                this.message="You are now in the revealer, where you can provide your previously tokenized card details. You can go back to the tokenizer with the button below"
            }else{
                this.tokenized=false;
                this.message= 'Welcome to the card capturer. Here you can provide your card details and VGS will secure them. You can also go to our revealer if you already have your tokenized info';
            }
        },
        sendToVGS() {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this)
              };
              
              //fetch('/backend-api', requestOptions).then(response => response.json()).then(data => console.log(data));
              fetch('https://tntqqqjpuoh.sandbox.verygoodproxy.com/backend-api', requestOptions).then(response => response.json()).then(data => {
                  console.log(data);
                  this.cardNumber=data.cardNumber;
                  this.ccv=data.ccv;
                  this.message="your card info has been secured!"
                  this.tokenized=true;
                });
            },
        sendToEchoVGS(){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this)
              };
              //username & password on outbound does not sound like a good idea
              fetch('/echo', requestOptions).then(response => response.json()).then(data => {
                  console.log("json data is: ",data);
                  this.cardNumber=data.cardNumber;
                  this.ccv=data.ccv;
                  this.message="For demo purposes the information has been revealed. You can go ahead and redact this value again"
                  this.tokenized=false;
                });
        }
    }
}

Vue.createApp(cardCapturer).mount('#cardCapturer');
