import pyodbc
import sys

server = r"192.168.20.254\SQLEXPRESS"
user = "NvAnalyzer"
password = "Grub6-Outbid0-Distort9-Caravan5-Gift9"
database = "DianaDB"

# List common drivers to try
drivers = [
    "{ODBC Driver 17 for SQL Server}",
    "{SQL Server Native Client 11.0}",
    "{SQL Server}",
]

for driver in drivers:
    print(f"\n--- Testing with driver: {driver} ---")
    conn_str = f"DRIVER={driver};SERVER={server};DATABASE={database};UID={user};PWD={password};Timeout=10"
    try:
        conn = pyodbc.connect(conn_str)
        print(f"SUCCESS: Connected with {driver}!")
        cursor = conn.cursor()
        cursor.execute("SELECT TOP 1 TABLE_NAME FROM INFORMATION_SCHEMA.TABLES")
        print(f"Verified query: {cursor.fetchone()}")
        conn.close()
        sys.exit(0)
    except Exception as e:
        print(f"ERROR with {driver}: {e}")

print("\nCould not connect with any pyodbc driver.")
