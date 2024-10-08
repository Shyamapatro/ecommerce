--- Find User wise - product-wise ordering quantity with total item value 

SELECT 
    U.id AS userId,
    U."firstName",
    U."lastName",
    P.id AS productId,
    P.name AS productName,
    SUM(OI.quantity) AS totalQuantity,
    SUM(OI.quantity * OI.price) AS totalValue
FROM 
    "Users" U
JOIN 
    "Orders" O ON U.id = O."userId"
JOIN 
    "OrderItems" OI ON O.id = OI."orderId"
JOIN 
    "Products" P ON OI."productId" = P.id
GROUP BY 
    U.id, U."firstName", U."lastName", P.id, P.name
ORDER BY 
    U.id, P.name;


---  second :::: Weekly Orders analysis for the first quarter of 2024

SELECT 
    DATE_TRUNC('week', O."createdAt") AS week_start,
    COUNT(O.id) AS total_orders,
    SUM(OI.quantity) AS total_quantity,
    SUM(OI.quantity * OI.price) AS total_value
FROM 
    "Orders" O
JOIN 
    "OrderItems" OI ON O.id = OI."orderId"
WHERE 
    O."createdAt" >= '2024-01-01' 
    AND O."createdAt" < '2024-04-01'  
GROUP BY 
    week_start
ORDER BY 
    week_start;



 
---  third-question ::: Retrieve the Product name and No. of Orders from Sales. Exclude products with fewer than 5 Orders.

SELECT 
    P.name AS product_name,
    COUNT("OI"."orderId") AS number_of_orders
FROM 
    "Products" P
JOIN 
    "OrderItems" "OI" ON P.id = "OI"."productId"
JOIN 
    "Orders" O ON "OI"."orderId" = O.id
GROUP BY 
    P.id, P.name
HAVING 
    COUNT("OI"."orderId") >= 5
ORDER BY 
    number_of_orders DESC;





---  forth  :::: Find the products that are sold more than 7 times or have not sold yet in the first quarter of 2024
SELECT 
    P.name AS product_name,
    COUNT(OI."orderId") AS total_sales
FROM 
    "Products" P
LEFT JOIN 
    "OrderItems" OI ON P.id = OI."productId"
LEFT JOIN 
    "Orders" O ON OI."orderId" = O.id AND O."createdAt" >= '2024-01-01' AND O."createdAt" < '2024-04-01'
GROUP BY 
    P.id
HAVING 
    COUNT(OI."orderId") > 7 OR COUNT(OI."orderId") = 0
ORDER BY 
    total_sales DESC;
