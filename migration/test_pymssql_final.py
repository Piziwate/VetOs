import pymssql
import sys

# Original host name as requested
server = r"NVSRV01\SQLEXPRESS"
user = "NvAnalyzer"
password = "Grub6-Outbid0-Distort9-Caravan5-Gift9"
database = "Diana"  # Corrected name

print(f"Retrying pymssql with server: {server} and database: {database}")

try:
    # pymssql sometimes prefers the port explicitly or different slashes
    # but let's try the most direct way first
    conn = pymssql.connect(server, user, password, database, timeout=10)
    cursor = conn.cursor()
    print("SUCCESS: Connected with pymssql!")
    
    cursor.execute("SELECT TOP 1 NachName FROM DiaAdrs")
    row = cursor.fetchone()
    print(f"Verified data: {row}")
    
    conn.close()
    sys.exit(0)
except Exception as e:
    print(f"ERROR with {server}: {e}")
    
    # Try with the full domain name if the short one fails
    server_full = r"nvsrv01.nacvet.local\SQLEXPRESS"
    print(f"\nRetrying with full name: {server_full}")
    try:
        conn = pymssql.connect(server_full, user, password, database, timeout=10)
        print("SUCCESS: Connected with full domain name!")
        conn.close()
    except Exception as e2:
        print(f"ERROR with {server_full}: {e2}")
        sys.exit(1)
