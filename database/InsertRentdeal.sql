---------------------------------------------------
---------------------------------------------------
---------    CREATE RENTDEAL     ------------------
---------------------------------------------------
---------------------------------------------------

CREATE OR REPLACE PROCEDURE procedureCreateRentDeal (
    inputUserID integer, --(From session) 
    inputPropertyID integer, --(From some kind of from i pressume)
    inputStartDate date,
    inputEndDate date,
    inputValue integer
)

LANGUAGE plpgsql 
AS $BODY$

	DECLARE
    nCurrentCreditcardID integer;
    nCurrentRentID integer;

BEGIN

IF EXISTS(
	SELECT tRented."dStart", tRented."dEnd", tProperty."nPropertyID"
   	FROM tRented
	JOIN tProperty
	ON tRented."nPropertyID" = tProperty."nPropertyID"
    WHERE tProperty."nPropertyID" = inputPropertyID
	AND inputStartDate<tRented."dEnd" 
	AND inputEndDate>tRented."dStart"
   	-- WHERE tRented."dEnd" >= TO_DATE(inputEndDate, 'YYYY-MM-DD') AND
    -- tRented."dStart" < TO_DATE(inputStartDate, 'YYYY-MM-DD')
) THEN
    RAISE WARNING 'Duplicate Date'; 
    RETURN;
    --USING HINT = 'Email already in use';
END IF;

-- Create Rent deal
INSERT INTO tRented("nUserID", "nPropertyID", "dStart", "dEnd")
VALUES(inputUserID, inputPropertyID, inputStartDate, inputEndDate);

-- Find creditcard based on user
SELECT tCreditcard."nCreditcardID"
INTO nCurrentCreditcardID
FROM tCreditcard
WHERE tCreditcard."nUserID" = inputUserID;

-- Find newly made Rent Deal
SELECT tRented."nRentID"
INTO nCurrentRentID
FROM tRented
WHERE tRented."nUserID" = inputUserID
AND tRented."nPropertyID" = inputPropertyID 
AND tRented."dStart" = inputStartDate
AND tRented."dEnd" = inputEndDate;

-- Create Payment
INSERT INTO tPayment("nCreditcardID", "nRentID", "nValue")
VALUES(nCurrentCreditcardID, nCurrentRentID, inputValue);

END;
$BODY$