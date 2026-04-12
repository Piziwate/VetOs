import pyodbc
import sys

server = r"192.168.20.254\SQLEXPRESS"
user = "NvAnalyzer"
password = "Grub6-Outbid0-Distort9-Caravan5-Gift9"
database = "Diana"

print(f"Connecting to database: {database}...")

conn_str = f"DRIVER={{SQL Server}};SERVER={server};DATABASE={database};UID={user};PWD={password};Timeout=10"
try:
    conn = pyodbc.connect(conn_str)
    print(f"SUCCESS: Connected to {database}!")
    cursor = conn.cursor()
    
    print("\nListing Tables in Diana:")
    cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
    tables = cursor.fetchall()
    for table in tables:
        print(f" - {table[0]}")
        
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
