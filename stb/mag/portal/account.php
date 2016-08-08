<style type="text/css">
    .payService{
        width: 100%;

    }

    .payService:hover{
        font-size: 2em;
        border: 1px solid #999;color:#000;
    }

</style>
<div class="container" style="padding: 20px 100px; top:20px; position:  relative; overflow: hidden; height: 250px;">
    <img title="" alt="" src="./images/ACCOUNT.png" style="float: left;">
    <div class="info_block" style="margin-top: 0; padding: 0; font-size: 16px;">
        <div class="active_block"> Учетная запись: 
            <span id="active"></span>
        </div>
        <div class="service_block"> Услуга: 
            <span id="service"></span>
        </div>
        <br/>
        <div class="money_block"> На счету: 
            <span id="money"></span> грн.
        </div>
        <!--
        <div class="discount_block"> Скидка: 
                <span id="discount"></span>%.
        </div>
        -->
        <div class="date_block"> Срок действия истекает: 
            <span id="date"></span>
        </div>
    </div>
    <div class="clearfix"></div>
    <table style="margin-top: 100px; margin-left: -50px; font-size: 13px;">
        <tbody>
            <tr >
                <td style="height: 30px;" align="left" ><div class="button-group" id="cardPayment_btn"><img style="float: left;" title="" alt="" src="./images/ButtonGreen.png">&nbsp; Пополнить счет карточкой</div></td>
                <td style="height: 30px;" align="center"><div class="button-group" id="activate_btn" style="display: none;"><img style="float: left;" title="" alt="" src="./images/ButtonYellow.png">&nbsp; Активировать пакет</div></td>
            </tr>
        </tbody>
    </table>
</div>
<script type="text/javascript" src="./js/account.js"></script>
<div class="popup" id="Card" style="display: none; position: relative; background: url(./images/timer_button.png); color: white; margin: -150px auto 0 auto; width: 300px; height: 80px; border: 1px solid white; padding: 10px 4px;">
    <div id="popup_form" action="" style="text-align: center;">
        <div style="font-size: 18px;">
            КОД ПОПОЛНЕНИЯ
        </div>
        <br/>
        <input style="color: white; font-size: 1.25em;" type="text" id="card_code" name="card_code" value=""/>
        &nbsp;
        <input type="button" id="confirm_card" name="enter" value="ВНЕСТИ"/>
    </div>
</div>
<div class="popup" id="Services" style="display: none; position: relative; color: white; margin: -200px auto 0 auto; background-color: #333; width: 300px; height: auto; border: 1px solid white; padding: 10px;">
    <div id="popup_form" action="" style="text-align: center;">
        <div style="font-size: 18px;">
            Оплатить пакет IPTV:
        </div>
        <br/>
        <div id="service-list">

        </div>
    </div>
</div>