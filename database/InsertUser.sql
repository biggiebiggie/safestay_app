---------------------------------------------------
---------------------------------------------------
---------    CREATE USER     ----------------------
---------------------------------------------------
---------------------------------------------------

CREATE OR REPLACE PROCEDURE procedureCreateUser(
    inputUsername character varying, 
    inputPassword character varying, 
    inputemail character varying, 
    inputPhonenumber character varying,
	inputPhonecode character varying,
	InputCountryCode character varying,
	inputIBAN character varying, 
	inputCVV char(3),
	inputExpirationDate char(4)
    )

LANGUAGE plpgsql 
AS $BODY$

	DECLARE 
    nCurrentUserID integer;
	nCurrentPhoneCode integer;
    nCurrentCountryCode integer;

BEGIN
	
	IF EXISTS(
	SELECT tUser."cUsername"
   	FROM tUser
   	WHERE inputUsername = tUser."cUsername"
    )THEN
        RAISE WARNING 'Duplicate username: %', inputUsername; 
		RETURN;
		--USING HINT = 'Email already in use';
	END IF;

    IF EXISTS(
	SELECT tUser."cEmail"
   	FROM tUser
   	WHERE inputemail = tUser."cEmail"
    )THEN
        RAISE WARNING 'Duplicate email: %', inputemail; 
		RETURN;
		--USING HINT = 'Email already in use';
	END IF;

	-- Check if Phonecode exists
	IF NOT EXISTS( 
	SELECT tPhoneCode."cPhoneCode" 
	FROM tPhoneCode
		WHERE tPhoneCode."cPhoneCode" = InputPhonecode
		) THEN 
		INSERT INTO tPhoneCode("cPhoneCode") 
		VALUES (InputPhonecode);
	END IF;
	
		-- Find Phonecode ID
	SELECT tPhoneCode."nPhoneCodeID"
	INTO nCurrentPhoneCode
	FROM tPhoneCode
	WHERE tPhoneCode."cPhoneCode" = InputPhonecode;

	-- Check if CountryCode exists
	IF NOT EXISTS( 
	SELECT tCountryCode."cCountryCode" 
	FROM tCountryCode
		WHERE tCountryCode."cCountryCode" = InputCountryCode
		) THEN 
		INSERT INTO tCountryCode("cCountryCode") 
		VALUES (InputCountryCode);
	END IF;

	--   Find CountryCode ID
	SELECT tCountryCode."nCountryCodeID"
	INTO nCurrentCountryCode
	FROM tCountryCode
	WHERE tCountryCode."cCountryCode" =  InputCountryCode;

	INSERT INTO tUser  
	(
		"cUsername", 
		"cPassword", 
		"cEmail", 
		"cPhoneNumber", 
		"nPhoneCodeID", 
		"nCountryCodeID"
	)
	VALUES 
	(	inputUsername, 
		inputPassword, 
		inputemail, 
		inputPhonenumber,
		nCurrentPhoneCode,
		nCurrentCountryCode
	);
	
	-- Find newly made user
	SELECT tUser."nUserID"
	INTO nCurrentUserID
	FROM tUser
	WHERE inputEmail = tUser."cEmail";

	-- Insert creditcard info
	INSERT INTO tCreditcard 
	(
		"nUserID",
		"cIBANcode", 
		"cCVV", 
		"cExpirationDate"
	)
	VALUES 
	(
		nCurrentUserID, 
		inputIBAN, 
		inputCVV,
		inputExpirationDate
	);
	
END;
$BODY$