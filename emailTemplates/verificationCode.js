const verificationCodeTemplate = data => {
    return (
        `<div style="300vh">
        <img src='https://ptdevbucket.s3.us-east-2.amazonaws.com/logofull.png'
         style="width:50%; resize-mode:contain; margin-left:20%;  margin-right:20%;"/>
       ${data.mainHeading && (` <h1 style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
                    font-size: 26px;
                    letter-spacing: .2px;
                    font-weight:bold;
                    color: #505456;
                    text-align:center;
                    position:absolute;
                    margin-top:-20%;
                    font-weight:bold;
                    margin-right:5%;
                    z-index:20px;
                    line-height: 20px;">${data.mainHeading}</h1>`)}
        
        <h1 style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
                    font-size: 20px;
                    letter-spacing: .2px;
                    font-weight:bold;                 
                    color: #272f32;
                    margin-bottom:10px;
                    margin-top:5%;
                    line-height: 20px;">${data.title}</h1>

        <p style="font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
                font-size: 16px;
                letter-spacing: .2px;
                color: #505456;
                line-height: 20px;">
                    ${data.message} <br/> verification code :
            <span style="font-weight:bold; color: #272f32;"> ${data.code}</span>
        </p>
        <div style="width:100%;
             height: 30%;
             background-color:#272f32;
             color: #f3f3f3; 
             font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
            font-size: 14px;
            letter-spacing: .2px;
            color: #f3f3f3;
            font-weight:300;
            margin-bottom:10px;
            line-height: 20px;
            padding:4%;
            margin-top:10%;  
            ">
            <h1 style=" 
            color: #f3f3f3; 
            font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
            font-size: 35px;">PT Anywhere</h1>
            <div style=" display:flex; flex-direction:row;">
          
            <div style="width:30%;">
                <p>Address:   <span style="margin-left:3%; font-weight:bold;">Amman - Swefieh</span> </p>
                <p>Tel:   <span style="margin-left:3%; font-weight:bold;">00962 6 5865205 </span> </p>          
                <p>Fax:   <span style="margin-left:3%; font-weight:bold;">00962 6 5865203 </span> </p>         

            </div>
            <div style ="margin-left:10%; width:50%;">
                <p>email:  <span style="margin-left:3%; font-weight:bold; color:#f3f3f3;">info@nts-jordan.com </span> </p>      
                <p>P.O.Box:  <span style="margin-left:3%; font-weight:bold;">579 Amman 11118 </span> </p>
            </div>
            </div>
        </div>
    </div>
    `
    )
}

module.exports = { verificationCodeTemplate }