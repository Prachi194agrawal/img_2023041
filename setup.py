from setuptools import setup, find_packages

setup(
    name="img_2023041",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn[standard]",
        "python-multipart",
        "pydantic",
        "joblib",
        "scikit-learn",
        "numpy",
        "pandas",
        "requests",
        "python-dotenv",
        "kafka-python",
        "websockets",
        "aiohttp",
    ],
) 