import pymssql
import sys

server = r"nvsrv01.nacvet.local\SQLEXPRESS"
user = "NvAnalyzer"
password = "Grub6-Outbid0-Distort9-Caravan5-Gift9"
database = "Diana"

print(f"Connecting to {server} to list species...")

try:
    conn = pymssql.connect(server, user, password, database)
    cursor = conn.cursor()
    
    # Query unique species from TierArt column
    cursor.execute("SELECT DISTINCT TierArt FROM DiaTiere WHERE TierArt IS NOT NULL AND TierArt <> '' ORDER BY TierArt")
    
    species = cursor.fetchall()
    
    print(f"\nFound {len(species)} unique species in the legacy database:\n")
    for s in species:
        print(f" - {s[0]}")
        
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
