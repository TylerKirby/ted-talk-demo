import csv
import codecs

from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from application.app import app, db
from application.models import Transcripts

migrate = Migrate(app, db)
manager = Manager(app)

# migrations
manager.add_command('db', MigrateCommand)

def unicode_csv_reader(unicode_csv_data, dialect=csv.excel, **kwargs):
    # csv.py doesn't do Unicode; encode temporarily as UTF-8:
    csv_reader = csv.reader(utf_8_encoder(unicode_csv_data),
                            dialect=dialect, **kwargs)
    for row in csv_reader:
        # decode UTF-8 back to Unicode, cell by cell:
        yield [unicode(cell, 'utf-8') for cell in row]

def utf_8_encoder(unicode_csv_data):
    for line in unicode_csv_data:
        yield line.encode('utf-8')

@manager.command
def create_db():
    """Creates the db tables."""
    db.drop_all()
    db.create_all()

    db.session.execute("SET NAMES utf8mb4;")
    db.session.execute("SET CHARACTER SET utf8mb4;")
    db.session.execute("SET character_set_connection=utf8mb4;")

    with codecs.open("transcripts.csv", "rb", encoding='utf-8') as csvfile:
        transcript_reader = unicode_csv_reader(csvfile, delimiter=',', quotechar='\"')

        transcript_reader.next() # header

        for transcript, url in transcript_reader:
            db.session.add(Transcripts(transcript, url))
            db.session.commit()
    
    print "Number of rows: "
    print db.session.query(Transcripts).count()
    
    # test_transcript = Transcripts("test text", "test_url")
    # db.session.add(test_transcript)
    # db.session.commit()

    # print "Test results"
    # test = Transcripts.query.filter_by(url="test_url").first()
    # print test.transcript


if __name__ == '__main__':
    manager.run()
