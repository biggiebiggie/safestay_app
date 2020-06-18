---------------------------------------------------
---------------------------------------------------
---------    CREATE PROPERTY     ------------------
---------------------------------------------------
---------------------------------------------------

CREATE OR REPLACE PROCEDURE procedurecreateproperty(
	inputpropertyownerid integer,
    inputtitle character varying,
    inputdescription character varying,
	inputpropertytype character varying,
	inputzipcode character varying,
	inputcityname character varying,
	inputaddress character varying,
	inputsize integer,
	inputhousesize integer,
	inputprice integer,
	inputbooleanethernet boolean,
	inputbooleananimals boolean,
	inputbooleanfamilyfriendly boolean,
	inputimage character varying
	)
	
LANGUAGE 'plpgsql'
AS $BODY$

	DECLARE
    nCurrentPropertyOwnerID integer;
    nCurrentPropertyTypeID integer;
    nCurrentCityID integer;
    nCurrentPropertyID integer;

BEGIN

-- Check if Property exists
IF EXISTS(
	SELECT tProperty."cAddress"
   	FROM tProperty
   	WHERE inputAddress = tProperty."cAddress"
) THEN
    RAISE WARNING 'Duplicate adress: %', inputAddress; 
    RETURN;

END IF;

-- Check if Property Type exists
IF NOT EXISTS( 
SELECT tPropertyType."cPropertyType" 
FROM tPropertyType
	WHERE tPropertyType."cPropertyType" = InputPropertyType
	) THEN 
	INSERT INTO tPropertyType("cPropertyType") 
	VALUES (InputPropertyType);
END IF;

-- Find PropertyType ID
SELECT tPropertyType."nTypeID"
INTO nCurrentPropertyTypeID
FROM tPropertyType
WHERE tPropertyType."cPropertyType" = inputPropertyType;

-- Check if City exists
IF NOT EXISTS( 
SELECT tCity."cCityName" 
FROM tCity
	WHERE tCity."cCityName" = InputCityName
	AND tCity."cZipcode" = InputZipcode
	) THEN 
	INSERT INTO tCity("cCityName", "cZipcode") 
	VALUES (InputCityName, InputZipcode);
END IF;

-- Find City ID
SELECT tCity."nCityID"
INTO nCurrentCityID
FROM tCity
WHERE tCity."cCityName" = InputCityName;


--   Insert new Property 
INSERT INTO tProperty("nPropertyOwnerID", "nTypeID", "nCityID", "cTitle", "cDescription", "cAddress", "nSize", "nHouseSize", "nPrice")
VALUES (inputpropertyownerid, nCurrentPropertyTypeID, nCurrentCityID, inputTitle, inputDescription, InputAddress, InputSize, inputHouseSize, inputPrice);

-- Find new property ID
SELECT tProperty."nPropertyID"
INTO nCurrentPropertyID
FROM tProperty
WHERE tProperty."cAddress" = InputAddress;

-- Insert new Facility to Property
INSERT INTO tFacility("nPropertyID", "bEthernet", "bAnimals", "bFamilyFriendly")
VALUES(nCurrentPropertyID, inputBooleanEthernet, inputBooleanAnimals, inputBooleanFamilyFriendly);

-- Insert Picture to Property 
INSERT INTO tPropertyImage("nPropertyID", "byteaImage")
VALUES(nCurrentPropertyID, inputImage);

END;
$BODY$;