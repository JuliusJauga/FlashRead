#include "PhysicsWorld.h"

PhysicsWorld::PhysicsWorld() {
    // collision configuration contains default setup for memory, collision setup. Advanced users can create their own configuration.
	m_collisionConfiguration = std::make_unique<btDefaultCollisionConfiguration>();

	// use the default collision dispatcher. For parallel processing you can use a diffent dispatcher (see Extras/BulletMultiThreaded)
	m_dispatcher = std::make_unique<btCollisionDispatcher>(m_collisionConfiguration.get());

	// btDbvtBroadphase is a good general purpose broadphase. You can also try out btAxis3Sweep.
	m_broadphase = std::make_unique<btDbvtBroadphase>();

	// the default constraint solver. For parallel processing you can use a different solver (see Extras/BulletMultiThreaded)
    m_solver = std::make_unique<btSequentialImpulseConstraintSolver>();

    dynamicsWorld = std::make_unique<btDiscreteDynamicsWorld>(m_dispatcher.get(), m_broadphase.get(),
																m_solver.get(), m_collisionConfiguration.get());

	dynamicsWorld->setGravity(btVector3(0, -30, 0));
}

PhysicsWorld::~PhysicsWorld() {
    for (int i = dynamicsWorld->getNumCollisionObjects() - 1; i >= 0; i--) {
		btCollisionObject* obj = dynamicsWorld->getCollisionObjectArray()[i];
		btRigidBody* body = btRigidBody::upcast(obj);
		if (body && body->getMotionState()) {
			delete body->getMotionState();
		}
		dynamicsWorld->removeCollisionObject(obj);
		auto ptr = static_cast<std::shared_ptr<btCollisionShape>*>(body->getUserPointer());
		delete ptr;
		delete obj;
	}
}

template <typename T>
void clearExpiredObjects(std::unordered_map<T, std::weak_ptr<btCollisionShape>>& map) {
	std::vector<T> objectsToRemove;
	for (auto& it : map) {
		if (it.second.expired()) {
			objectsToRemove.push_back(it.first);
		}
	}
	for (auto& obj : objectsToRemove) map.erase(obj);
}

void PhysicsWorld::Update() {
	clearExpiredObjects(m_boxShapes);
	clearExpiredObjects(m_sphereShapes);
	clearExpiredObjects(m_capsuleShapes);
}

void PhysicsWorld::SetTransform(btTransform& transform, const glm::vec3& position, const glm::vec3& rotation) {
	transform.setOrigin(btVector3(position.x, position.y, position.z));

	glm::quat rot = glm::quat(glm::radians(rotation));
	transform.setRotation(btQuaternion(rot.x, rot.y, rot.z, rot.w));
}

std::shared_ptr<btCollisionShape> PhysicsWorld::GetBoxCollider(const glm::vec3& halfExtents) {
	const glm::vec3& key = halfExtents;
	// check if exists
	auto it = m_boxShapes.find(key);
	if (it != m_boxShapes.end()) {
		auto ptr = it->second.lock();
		if (ptr) return ptr;
	}
	// create new
	auto ptr = std::make_shared<btBoxShape>(btVector3(halfExtents.x, halfExtents.y, halfExtents.z));
	m_boxShapes[key] = ptr;
	return ptr;
}
std::shared_ptr<btCollisionShape> PhysicsWorld::GetSphereCollider(float radius) {
	float key = radius;
	// check if exists
	auto it = m_sphereShapes.find(key);
	if (it != m_sphereShapes.end()) {
		auto ptr = it->second.lock();
		if (ptr) return ptr;
	}
	// create new
	auto ptr = std::make_shared<btSphereShape>(radius);
	m_sphereShapes[key] = ptr;
	return ptr;
}
std::shared_ptr<btCollisionShape> PhysicsWorld::GetCapsuleCollider(float radius, float height) {
	glm::vec2 key(radius, height);
	// check if exists
	auto it = m_capsuleShapes.find(key);
	if (it != m_capsuleShapes.end()) {
		auto ptr = it->second.lock();
		if (ptr) return ptr;
	}
	// create new
	auto ptr = std::make_shared<btCapsuleShape>(radius, height);
	m_capsuleShapes[key] = ptr;
	return ptr;
}

btRigidBody* PhysicsWorld::CreateRigidBody(std::shared_ptr<btCollisionShape> colShape, float mass, const glm::vec3& position, const glm::vec3& rotation) {
	btTransform transform;
	SetTransform(transform, position, rotation);

	bool isDynamic = (mass != 0.f);

	btVector3 localInertia(0, 0, 0);
	if (isDynamic) colShape->calculateLocalInertia(mass, localInertia);

	auto motionState = new btDefaultMotionState(transform);
	btRigidBody::btRigidBodyConstructionInfo rbInfo(mass, motionState, colShape.get(), localInertia);
	auto body = new btRigidBody(rbInfo);
	dynamicsWorld->addRigidBody(body);
	
	auto userData = new RigidBodyUserData();
	userData->collisionShape = std::move(colShape);
	body->setUserPointer(userData);

	return body;
}
void PhysicsWorld::DestroyRigidBody(btRigidBody* rigidBody) {
	if (!rigidBody) return;
	dynamicsWorld->removeRigidBody(rigidBody);
    if (auto motionState = rigidBody->getMotionState()) delete motionState;
	auto userData = static_cast<RigidBodyUserData*>(rigidBody->getUserPointer());
    delete userData;
    delete rigidBody;
}


void PhysicsWorld::CheckObjectsTouchingGround() {
	// remove old flags
	for (int i = dynamicsWorld->getNumCollisionObjects() - 1; i >= 0; i--) {
		btCollisionObject* obj = dynamicsWorld->getCollisionObjectArray()[i];
		auto userData = static_cast<RigidBodyUserData*>(obj->getUserPointer());
		if (userData) userData->onGround = false;
	}

	// get new flags
	const float threshold = 0.5f;
    int numManifolds = dynamicsWorld->getDispatcher()->getNumManifolds();
    for (int i = 0; i < numManifolds; i++) {
        auto contactManifold = dynamicsWorld->getDispatcher()->getManifoldByIndexInternal(i);
        auto objA = contactManifold->getBody0();
        auto objB = contactManifold->getBody1();

		int numContacts = contactManifold->getNumContacts();
		for (int j = 0; j < numContacts; j++) {
			btManifoldPoint& point = contactManifold->getContactPoint(j);
			if (point.getDistance() < 0.05f) {
				if (point.m_normalWorldOnB.y() > threshold) {
					auto userData = static_cast<RigidBodyUserData*>(objA->getUserPointer());
					if (userData) userData->onGround = true;
					break;
				}
				if (point.m_normalWorldOnB.y() < -threshold) {
					auto userData = static_cast<RigidBodyUserData*>(objB->getUserPointer());
					if (userData) userData->onGround = true;
					break;
				}
			}
		}
    }
}