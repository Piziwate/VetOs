import pyodbc
import sys

server = r"192.168.20.254\SQLEXPRESS"
user = "NvAnalyzer"
password = "Grub6-Outbid0-Distort9-Caravan5-Gift9"
database = "Diana"

conn_str = f"DRIVER={{SQL Server}};SERVER={server};DATABASE={database};UID={user};PWD={password};Timeout=10"
try:
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    
    print("\n--- Sample Clients (DiaAdrs) ---")
    cursor.execute("SELECT TOP 5 * FROM DiaAdrs")
    columns = [column[0] for row in cursor.description for column in [row]] # This is not quite right, let's fix it
    
    # Correct way to get column names in pyodbc
    columns = [column[0] for column in cursor.description]
    print(f"Columns: {columns}")
    for row in cursor.fetchall():
        print(row)

    print("\n--- Sample Animals (DiaTiere) ---")
    cursor.execute("SELECT TOP 5 * FROM DiaTiere")
    columns = [column[0] for column in cursor.description]
    print(f"Columns: {columns}")
    for row in cursor.fetchall():
        print(row)
        
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
