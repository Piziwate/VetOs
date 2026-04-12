import pyodbc
import sys

server = r"192.168.20.254\SQLEXPRESS"
user = "NvAnalyzer"
password = "Grub6-Outbid0-Distort9-Caravan5-Gift9"

print(f"Testing connection to MASTER database on {server}...")

conn_str = f"DRIVER={{SQL Server}};SERVER={server};DATABASE=master;UID={user};PWD={password};Timeout=10"
try:
    conn = pyodbc.connect(conn_str)
    print("SUCCESS: Connected to MASTER!")
    cursor = conn.cursor()
    
    print("\nListing accessible databases:")
    cursor.execute("SELECT name FROM sys.databases")
    for row in cursor.fetchall():
        print(f" - {row[0]}")
        
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
