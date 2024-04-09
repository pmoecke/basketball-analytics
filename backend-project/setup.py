import os
from setuptools import setup, find_packages


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()


setup(
    name="dummy_server",
    version="0.0.1",
    description="Backend for the dummy project of the XAI-IML 2024 course.",
    long_description=read("README.md"),
    classifiers=[
        "Intended Audience :: Developers",
        "Natural Language :: English",
        "Programming Language :: Python :: 3",
        "Development Status :: 4 - Beta",
    ],
    entry_points={
        "console_scripts": [
            "start-server = dummy_server.router.app:start_server",
        ]
    },
    install_requires=[
        "Flask>=2.0.0",
        "flask-restful>=0.3.9",
        "flask-cors>=3.0.10",
        "pandas>=1.4.1",
        "scikit-learn>=1.0.2",
        "psutil>=5.9.0",
        "aniso8601==9.0.1",
        "blinker==1.7.0",
        "click==8.1.7",
        "importlib_metadata==7.1.0",
        "itsdangerous==2.1.2",
        "Jinja2==3.1.3",
        "MarkupSafe==2.1.5",
        "marshmallow==3.21.1",
        "numpy==1.26.4",
        "packaging==24.0",
        "python-dateutil==2.9.0.post0",
        "pytz==2024.1",
        "six==1.16.0",
        "tqdm==4.66.2",
        "tzdata==2024.1",
        "Werkzeug==3.0.2",
        "zipp==3.18.1",
    ],
    packages=find_packages(where="src", include=["dummy_server*"]),
    package_dir={"": "src"},
)
