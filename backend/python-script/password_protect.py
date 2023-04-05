import boto3
import pymongo
import string
import random
import patoolib
import pyzipper
import os
import sys
import shutil
from dotenv import load_dotenv
import traceback
import json
load_dotenv('../.env')


class settings:
	AWS_SERVER_PUBLIC_KEY=os.getenv('ACCESS_KEY')
	AWS_SERVER_SECRET_KEY=os.getenv('SECRET_ACCESS_KEY')
	AWS_BUCKET_REGION=os.getenv('AWS_BUCKET_REGION')
	AWS_BUCKET_NAME=os.getenv('AWS_BUCKET_NAME')
	MONGO_URL=os.getenv('MongoURI')
	PASSWORD_LENGTH=20
	temp_extract_loc='./uploads/temp/'
	zippedDir='./uploads/protectedZip/'
	downloadloc='./uploads/archive/'
	upload_folder='./uploads/'
	zippable_folder=None



if not os.path.exists(settings.temp_extract_loc):
   os.makedirs(settings.temp_extract_loc)
   print("temp directory is created!")


if not os.path.exists(settings.zippedDir):
   os.makedirs(settings.zippedDir)
   print("zipped directory is created!")

if not os.path.exists(settings.downloadloc):
   os.makedirs(settings.downloadloc)
   print("download directory is created!")


def deleteFolder(mydir):
    shutil.rmtree(mydir)

def s3Client():
	return boto3.client('s3', aws_access_key_id=settings.AWS_SERVER_PUBLIC_KEY, aws_secret_access_key=settings.AWS_SERVER_SECRET_KEY,region_name=settings.AWS_BUCKET_REGION)

def mongoClient():
	return pymongo.MongoClient(settings.MONGO_URL)

def downloadFile(client,filename):
	foldername='archive/'
	key=foldername+filename
	downloadLoc=settings.downloadloc+filename
	client.download_file(settings.AWS_BUCKET_NAME, key, downloadLoc)
	return downloadLoc

def uploadFile(client,filename):
	foldername='protected_archive/'
	key=foldername+filename
	downloadLoc=settings.zippedDir+filename
	print(downloadLoc)
	client.upload_file(downloadLoc,settings.AWS_BUCKET_NAME,  key)

def passwordGen():
   letters = string.ascii_lowercase+string.ascii_uppercase+string.digits
   return ''.join(random.choice(letters) for i in range(settings.PASSWORD_LENGTH))


def zip_folderPyzipper(folder_path, output_path,password):
    
    """Zip the contents of an entire folder (with that folder included
    in the archive). Empty subfolders will be included in the archive
    as well.
    """

    parent_folder = os.path.dirname(folder_path)
    # Retrieve the paths of the folder contents.
    contents = os.walk(folder_path)
    
    zip_file = pyzipper.AESZipFile(output_path,'w',compression=pyzipper.ZIP_DEFLATED,encryption=pyzipper.WZ_AES)
    zip_file.pwd=password
    for root, folders, files in contents:
        # Include all subfolders, including empty ones.
        for folder_name in folders:
            absolute_path = os.path.join(root, folder_name)
            relative_path = absolute_path.replace(parent_folder + '\\',
                                                    '')
            print ("Adding '%s' to archive." % relative_path.replace(settings.temp_extract_loc,''))
            zip_file.write(absolute_path, relative_path.replace(settings.temp_extract_loc,''))
        for file_name in files:
            absolute_path = os.path.join(root, file_name)
            relative_path = absolute_path.replace(parent_folder + '\\',
                                                    '')
            print ("Adding '%s' to archive." % relative_path.replace(settings.temp_extract_loc,''))
            zip_file.write(absolute_path, relative_path.replace(settings.temp_extract_loc,''))

    print ("'%s' created successfully." % output_path)
    zip_file.close()
   





if __name__ == '__main__':
	client = mongoClient()
	s3_client=s3Client()
	db = client.test
	rooms=db.room_schemas
	#lock all rooms
	lockkey=passwordGen()

	for room in rooms.find( { "isZipped": False , "ignoreZip":False ,"lock":False, "archivename" :{ "$ne":None}}):
		rooms.update_one({"roomID":room['roomID']},{ "$set": { "lock":True,"lock_key":lockkey} })

	for room in rooms.find( { "isZipped": False , "ignoreZip":False ,"lock":True,"lock_key":lockkey, "archivename" :{ "$ne":None}}):
		errorsList=[]
		try:
			print(room)
			archive_path=downloadFile(s3_client,room['archivename'])
			if not os.path.exists(settings.temp_extract_loc.strip()):
				os.makedirs(settings.temp_extract_loc)
			#archive original temp path and name and setting unzip dir --can be rar or zip
			archiveTemp=room['archivename']
			outdir=settings.temp_extract_loc+room['roomID']+"/"
			#archive name after protected .zip ext
			archive=archiveTemp.split(".")[0]+".zip"
			#unzip/unrar
			print("----------")
			print(archive_path)
			patoolib.extract_archive(archive_path, outdir=outdir)

			#conitions to select root folder to zip
			if(len(os.listdir(outdir))>1):
				settings.zippable_folder=outdir
			else:
				settings.zippable_folder=outdir+os.listdir(outdir)[0]
			print(os.path.abspath(settings.zippable_folder))
			#zip file absolute path
			zipfile=os.path.join(os.path.abspath(settings.zippedDir),archive)
			#password gen...converted to bytes
			password= passwordGen()
			passwordBytes= bytes (password,'utf-8')
			print(password)
			#zip and store errors
            
			zip_folderPyzipper(settings.zippable_folder, zipfile,passwordBytes)
			uploadFile(s3_client,archive)
			rooms.update_one({"roomID":room['roomID']},{ "$set": { "isZipped": True  ,
			"password":password ,"error_zipping": None ,
			"protectedzip":archive ,"lock":False,"lock_key":None} })
		except Exception as e:
			error=json.dumps({
				"error":str(e),
				"error_description":traceback.format_exc(),
				"line_number":sys.exc_info()[-1].tb_lineno
			})
			print(error)
			
			rooms.update_one({"roomID":room['roomID']},{ "$set": { "error_zipping":  error,"isZipped": False, "protectedzip":None,"ignoreZip":True,"lock":False,"lock_key":None } })
		
	#release all locks
	for room in rooms.find( { "lock":True,"lock_key":lockkey }):
		rooms.update_one({"roomID":room['roomID']},{ "$set": { "lock":False,"lock_key":None } })
	count= len(list(rooms.find( { "lock":True})))
	if(count==0):
		deleteFolder(settings.upload_folder)
 