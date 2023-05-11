"use strict";
var directListingBtn = document.getElementById("0");
var auctionListingBtn = document.getElementById("1");

if(directListingBtn){
    directListingBtn.addEventListener("click", async() => {

        var listType = localStorage.getItem('listType');
        var typeID = Number(0);

        if (listType === "none") {
            localStorage.setItem('listType', typeID);
            document.getElementById(typeID).classList.add('toggleListType');
            document.getElementById('inputType').value = typeID;
        } else {
            document.getElementById(listType).classList.remove('toggleListType');
            document.getElementById(typeID).classList.add('toggleListType');
            localStorage.setItem('listType',typeID);
            document.getElementById('inputType').value = typeID;
        }

        document.getElementById('listingForm').classList.remove('hidden')
        document.getElementById('ReservePrice').classList.add('hidden');
        document.getElementById('ReservePriceLabel').classList.add('hidden');
        document.getElementById('ReservePriceLabel2').classList.add('hidden');
        document.getElementById('ReservePriceLabel3').classList.add('hidden');
        document.getElementById('ReservePrice').classList.remove('required');
    });
}


if(auctionListingBtn){
    auctionListingBtn.addEventListener("click", async() => {

        var listType = localStorage.getItem('listType');
        var typeID = Number(1);

        if (listType === "none") {
            localStorage.setItem('listType', typeID);
            document.getElementById(typeID).classList.add('toggleListType');
            document.getElementById('inputType').value = typeID;
        } else {
            document.getElementById(listType).classList.remove('toggleListType');
            document.getElementById(typeID).classList.add('toggleListType');
            localStorage.setItem('listType',typeID);
            document.getElementById('inputType').value = typeID;
        }

        document.getElementById('listingForm').classList.remove('hidden')
        document.getElementById('ReservePrice').classList.remove('hidden');
        document.getElementById('ReservePriceLabel').classList.remove('hidden');
        document.getElementById('ReservePriceLabel2').classList.remove('hidden');
        document.getElementById('ReservePriceLabel3').classList.remove('hidden');
        document.getElementById('ReservePrice').classList.add('required');
    });
}